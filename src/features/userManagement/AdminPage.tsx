import { Admin, Resource} from "react-admin";
import { Layout } from "./adminLayout";
import simpleRestProvider from 'ra-data-simple-rest';
import { UserCreate, UserEdit, UserList, UserShow } from "./users";

const dataProvider = simpleRestProvider('http://127.0.0.1:8000');

export const AdminPage = () => (
    <Admin basename="/admin" layout={Layout} dataProvider={dataProvider}>
        <Resource name="users" list={UserList}  show={UserShow} edit={UserEdit} create={UserCreate}/>
    </Admin>
);   