import { Subject } from 'rxjs';

export class SelectionModel<T, U> {
  private _selection: Map<U, number> = new Map<U, number>();
  private _deselectedToEmit: T[] = [];
  private _selectedToEmit: T[] = [];

  selected: T[] | null;
  changed: Subject<SelectionChange<T, U>> = new Subject();

  constructor(
    public multiple = false,
    private keyFn = (value: T): U => (value as unknown) as U,
    initiallySelectedValues?: T[],
    private _emitChanges = true
  ) {
    if (initiallySelectedValues && initiallySelectedValues.length) {
      if (multiple) {
        initiallySelectedValues.forEach(value => this._markSelected(value));
      } else {
        this._markSelected(initiallySelectedValues[0]);
      }

      // Clear the array in order to avoid firing the change event for preselected values.
      this._selectedToEmit.length = 0;
    }
  }

  select(...values: T[]): void {
    this._verifyValueAssignment(values);
    values.forEach(value => this._markSelected(value));
    this._emitChangeEvent();
  }

  deselect(...values: T[]): void {
    this._verifyValueAssignment(values);
    values.forEach(value => this._unmarkSelected(value));
    this._emitChangeEvent();
  }

  toggle(value: T): void {
    this.isSelected(value) ? this.deselect(value) : this.select(value);
  }

  clear(): void {
    this._unmarkAll();
    this._emitChangeEvent();
  }

  isSelected(value: T): boolean {
    return this._selection.has(this.keyFn(value));
  }

  isEmpty(): boolean {
    return this._selection.size === 0;
  }

  hasValue(): boolean {
    return !this.isEmpty();
  }

  private _emitChangeEvent() {
    if (this._selectedToEmit.length || this._deselectedToEmit.length) {
      this.changed.next({
        source: this,
        added: this._selectedToEmit,
        removed: this._deselectedToEmit
      });

      this._deselectedToEmit = [];
      this._selectedToEmit = [];
    }
  }

  private _markSelected(value: T) {
    if (!this.isSelected(value)) {
      if (!this.multiple) {
        this._unmarkAll();
      }
      this._selection.set(this.keyFn(value), this.selected.length);
      if (this._emitChanges) {
        this._selectedToEmit.push(value);
      }
      this.selected.push(value);
    }
  }

  private _unmarkSelected(value: T) {
    if (this.isSelected(value)) {
      this.selected.splice(this._selection.get(this.keyFn(value)), 1);
      this._selection.delete(this.keyFn(value));

      if (this._emitChanges) {
        this._deselectedToEmit.push(value);
      }
    }
  }

  private _unmarkAll() {
    if (!this.isEmpty()) {
      this.selected.forEach(value => this._unmarkSelected(value));
    }
  }

  private _verifyValueAssignment(values: T[]) {
    if (values.length > 1 && !this.multiple) {
      throw getMultipleValuesInSingleSelectionError();
    }
  }
}

export interface SelectionChange<T, U> {
  source: SelectionModel<T, U>;
  added: T[];
  removed: T[];
}

export function getMultipleValuesInSingleSelectionError() {
  return Error('Cannot pass multiple values into SelectionModel with single-value mode.');
}
