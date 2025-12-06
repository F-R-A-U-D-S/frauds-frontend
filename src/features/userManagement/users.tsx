import { BooleanField, BooleanInput, Create, DataTable, DateField, EditButton, List, NumberInput, PasswordInput } from 'react-admin';

export const UserList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="employee_number"/>
            <DataTable.Col source="name" />
            <DataTable.Col source="username" />
            <DataTable.Col source="title"/>
            <DataTable.Col label="Admin">
                <BooleanField source="is_admin" />
            </DataTable.Col>
            <DataTable.Col label="Created On">
                <DateField source="created_at" />
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

import { Edit, SimpleForm, TextInput } from 'react-admin';

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="username" />
            <PasswordInput source="password_hash" label="Password" />
            <TextInput source="title" />
            <BooleanInput source="is_admin" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <NumberInput source="employee_number" />
            <TextInput source="name" />
            <TextInput source="username" />
            <PasswordInput source="password_hash" label="Password" />
            <TextInput source="title" />
        </SimpleForm>
    </Create>
);

import { NumberField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <NumberField source="employee_number" />
            <TextField source="name" />
            <TextField source="username" />
            <TextField source="title" />
            <BooleanField source="is_admin" />
            <DateField source="created_at" showTime />
        </SimpleShowLayout>
    </Show>
);