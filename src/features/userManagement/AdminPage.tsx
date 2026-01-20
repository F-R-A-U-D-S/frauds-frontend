import { Admin, Resource } from "react-admin";
import { Layout } from "./adminLayout";
import adminDataProvider from "./adminDataProvider";
import { UserCreate, UserEdit, UserList, UserShow } from "./users";

export const AdminPage = () => (
  <Admin basename="/admin" layout={Layout} dataProvider={adminDataProvider}>
    <Resource
      name="users"
      list={UserList}
      show={UserShow}
      edit={UserEdit}
      create={UserCreate}
    />
  </Admin>
);
