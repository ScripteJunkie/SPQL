import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { media } from 'styles/media';
import axios from 'axios';
import { UlidMonotonic } from 'id128';

import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
} from 'firebase/firestore';

import { db, auth } from 'utils/firebase-init';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { BsSearch } from 'react-icons/bs';

import { Grid } from 'app/components/Loading/Grid';
import { Query } from 'app/components/Result/Query';
import { set } from 'shelljs';

export function SchemaPage() {
  const [appName, setAppName] = React.useState('rvgapp');
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [schema, setSchema] = React.useState('');

  const listCollections = async () => {
    const q = query(collection(db, 'schema', appName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      console.log(doc.id, ' => ', doc.data());
    });
  };

  const dialects = [
    { name: 'Aurora MySQL', code: 'Aurora MySQL' },
    { name: 'Aurora PostgreSQL', code: 'Aurora PostgreSQL' },
    { name: 'Cassandra', code: 'Cassandra' },
    { name: 'CockroachDB', code: 'CockroachDB' },
    { name: 'DB2', code: 'DB2' },
    { name: 'Django ORM', code: 'Django ORM' },
    { name: 'DuckDB', code: 'DuckDB' },
    { name: 'DynamoDB', code: 'DynamoDB' },
    { name: 'Elasticsearch', code: 'Elasticsearch' },
    { name: 'Firestore', code: 'Firestore' },
    { name: 'MariaDB', code: 'MariaDB' },
    { name: 'MongoDB', code: 'MongoDB' },
    { name: 'MySQL', code: 'MySQL' },
    { name: 'Oracle', code: 'Oracle' },
    { name: 'PostgreSQL', code: 'PostgreSQL' },
    { name: 'Redshift', code: 'Redshift' },
    { name: 'Snowflake', code: 'Snowflake' },
    { name: 'SQL Server', code: 'SQL Server' },
    { name: 'SQLite', code: 'SQLite' },
  ];

  const [dialect, setDialect] = React.useState(dialects[0]);
  const selectedDialect = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const dialectOptionTemplate = option => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Schema</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <form
        onSubmit={async e => {
          e.preventDefault();
          console.log(name, schema);
          setLoading(true);
          const ulid = UlidMonotonic.generate().toRaw();
          const schemaRef = doc(db, 'schema', appName);
          const schmeaSnap = await getDoc(schemaRef);
          if (schmeaSnap.exists()) {
            await updateDoc(schemaRef, {
              meta: {
                updated: new Date().toUTCString(),
              },
            }).catch(e => {
              console.log(e);
            });
          } else {
            await setDoc(schemaRef, {
              name: appName,
              id: UlidMonotonic.generate().toRaw(),
              meta: {
                created: new Date().toUTCString(),
                updated: new Date().toUTCString(),
              },
            }).catch(e => {
              console.log(e);
            });
          }
          const docRef = doc(db, 'schema', appName, 'schema', ulid);
          listCollections()
            .then(() => {
              console.log('done');
            })
            .catch(e => {
              console.log(e);
            });
          await setDoc(docRef, {
            name: name,
            id: ulid,
            dialect: dialect.name,
            schema: schema,
            active: true,
            meta: {
              created: new Date().toUTCString(),
              updated: new Date().toUTCString(),
            },
          }).catch(e => {
            console.log(e);
          });
          setName('');
          setSchema('');
          setDialect(dialects[0]);
          setLoading(false);
        }}
        className="mx-auto w-full mt-4"
        style={{ maxWidth: '50rem' }}
      >
        <InputText
          name="schema_name"
          value={name}
          autoComplete="off"
          placeholder="Schema Name"
          required
          onChange={e => {
            setName(e.currentTarget.value);
          }}
          className="w-full m-1"
        />
        <Dropdown
          value={dialect}
          onChange={e => {
            if (e.value !== dialect) {
              setDialect(e.value);
            }
          }}
          options={dialects}
          optionLabel="dialect"
          placeholder="Select a Query Language"
          required
          valueTemplate={selectedDialect}
          itemTemplate={dialectOptionTemplate}
          className="w-20rem m-1 dialectSelect"
        />
        <InputTextarea
          name="description"
          value={schema}
          placeholder="Schema"
          required
          onChange={e => {
            setSchema(e.currentTarget.value);
            console.log(e.currentTarget.value);
          }}
          className="w-full m-1 h-25rem"
        />
        <Button
          label="Submit"
          type="submit"
          icon="pi pi-check"
          className="w-full m-1"
        />
      </form>
      {loading && (
        <div className="mx-auto w-full mt-4" style={{ maxWidth: '50rem' }}>
          <Grid text={'Setting schema...'} />
        </div>
      )}
      <div className="mx-auto w-full mt-4" style={{ maxWidth: '50rem' }}>
        {!loading && schema && name && (
          <p className="text-2xl font-bold" style={{ fontFamily: 'Open Sans' }}>
            {name} - Preview
          </p>
        )}
        {!loading && schema && !name && (
          <p className="text-2xl font-bold" style={{ fontFamily: 'Open Sans' }}>
            Preview
          </p>
        )}
        {!loading && schema && dialect && (
          <>
            <p className="text-md" style={{ fontFamily: 'Open Sans' }}>
              Dialect: {dialect.name}
            </p>
            <hr />
          </>
        )}
        {!loading && schema && (
          <div className="flex justify-end bg-gray-800 p-4">
            <code
              className="text-sm"
              id="schema_preview"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {schema}
            </code>
          </div>
        )}
      </div>
    </>
  );
}
