# linking-tool

Library for managing routes in Angular application.

There are 2 ways of handling routes - you can create a tree of links, or a map. Both are plain JSON text objects.

Table of contents
-
1. Generating links
    - using a map
    - using a tree
2. Using links service in an app
    - with a links map
    - with a links tree

Generating links
-
Common requirements:
- every routing module name has to fit the following pattern `*-routing.module.ts`
- route declarations have to be in a `routes` local variable

Common recommendations:
- create some enum with link types, like the following:
```
export enum LinkType {
    Admin = 'admin',
    User = 'user',
    AdminUserPermissions = 'adminUserPermissions'
}
```
#### Using links map

Requirements to generating links map:
- every route declaration has to have an unique link type, passed in `data` route's property

#### Example
Consider the following routing module:
```
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    data: {
      links: LinkType.Admin
    },
    children: [
      {
        path: 'user',
        component: AdminUserContainerComponent,
        children: [
          {
            path: ':id',
            data: {
              links: LinkType.AdminUser
            },
            component: AdminUserComponent,
            children: [
              {
                path: 'permissions',
                data: {
                  links: LinkType.AdminUserPermissions
                },
                component: AdminUserPermissionsComponent
              }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule {}
```

Then after running schematics as the following: 
```
ng g @valueadd/linking-tool:generate-links 
\--resultPath=<path where you want to save links map>
\--resultType=map 
```

Generated links map has the following structure:
```
{
    admin: "admin",
    adminUser: "admin/user/:id",
    adminUserPermissions: "admin/user/:id/permissions"
}
```

Note that every link has to have an unique key, so it is not overwritten in a  result map.

#### Using links tree

Requirements to generating links tree:
- every route declaration <u>does not have</u> to have an unique link type, passed in `data` route's property

#### Example

Consider the following routing module:
```
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    data: {
      links: LinkType.Admin
    },
    children: [
      {
        path: 'user',
        component: AdminUserContainerComponent,
        children: [
          {
            path: ':id',
            data: {
              links: LinkType.User
            },
            component: AdminUserComponent,
            children: [
              {
                path: 'permissions',
                data: {
                  links: LinkType.Permissions
                },
                component: AdminUserPermissionsComponent
              }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule {}
```

Then after running schematics as the following: 
```
ng g @valueadd/linking-tool:generate-links 
\--resultPath=<path where you want to save links tree>
\--resultType=tree
```

Tree has the following structure:
```
{
  admin: {
    _: "admin",
    user: {
      _: "admin/user/:id",
      permissions: "admin/user/:id/permissions"
    }
  }
}
```

Attention: `_` is a reserved character to resolve route in a tree, so you shouldn't use this as a link type.

Note that route keys does not have to be unique. It makes link type enum smaller and easier to maintain.

Using links service in an app
-
`Link<T = string>` object:
- `params?: LinkParams` - optional params for a link
- `path?: string` - optional path of a link 
- `type?: T` - optional type of a link (`string` by default - we are recommending passing a link type enum here) 

`LinkParams` object:
- `anchor?: string` - link to an anchor on a page
- `embedded?: { id: string }` - embedded value to a link
- `queryParams?: Params` - query params
- `skipLocationChange?: boolean` - whether should skip location change

#### With a links map
Import linking tool module in app module as the following:
```
LinksMapModule.forRoot(<links map object>, <link type enum> (optional))
```

Then in app you can use a `LinksMapService` with the following API:
- `resolveLinkUrl` - get url string based on links map, passing a `Link` object
- `resolveRouterLink` - get RouterLink based on links map, passing a `Link` object

#### With a links tree
Import linking tool module in app module as the following:
```
LinksTreeModule.forRoot(<links tree object>, <link type enum> (optional))
```

Then in app you can use a `LinksTreeService` with the following API:
- `resolveLinkUrl` - get url string based on links tree, passing a `Link` array (path to a link)
- `resolveRouterLink` - get RouterLink based on links tree, passing a `Link` array (path to a link)
