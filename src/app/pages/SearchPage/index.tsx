import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { media } from 'styles/media';
import axios from 'axios';

import { db } from 'utils/firebase-init';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { BsSearch } from 'react-icons/bs';

import { Grid } from 'app/components/Loading/Grid';
import { Query } from 'app/components/Result/Query';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { set } from 'shelljs';
import { useParams } from 'react-router-dom';

const genQuery = async (appName: string, input: string, schema_id: string) => {
  const response = await axios.post(
    'https://datajungle.co/callout',
    {
      app_id: appName,
      prompt: input.toString(),
      schema_id: schema_id,
      user: 'amaze',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
  return response.data;
};

const fetchSchema = async appName => {
  const docRef = doc(db, 'schema', appName);
  let schemas: any[] = [];
  await getDocs(collection(db, 'schema', appName, 'schema')).then(
    querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.exists()) {
          schemas.push(doc.data());
        }
      });
    },
  );
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.log('No such document!');
    return { schema: null, schemas: null };
  }
  return { schema: docSnap.data(), schemas };
};

const SearchBar = styled.div`
  width: 100%;
  padding: 0 1rem;
  .searchInput,
  .searchButton {
    text-overflow: ellipsis;
    padding: 0.5rem;
    font-size: 1rem;
  }
  ${media.small} {
    width: max(30rem, 80%);
    .searchInput,
    .searchButton {
      padding: 0.8rem;
      font-size: 1.1rem;
    }
  }
  ${media.medium} {
    max-width: 50rem;
    .searchInput,
    .searchButton {
      padding: 0.8rem;
      font-size: 1.2rem;
    }
  }
`;

export function SearchPage() {
  const appName = useParams()['appName'];
  console.log(appName);
  const [search, setSearch] = React.useState('');
  const [schema, setSchema] = React.useState(null as any);
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Loading...');
  const [result, setResult] = React.useState(null);

  // const dialects = [
  //   { name: 'Aurora MySQL', code: 'Aurora MySQL' },
  //   { name: 'Aurora PostgreSQL', code: 'Aurora PostgreSQL' },
  //   { name: 'Cassandra', code: 'Cassandra' },
  //   { name: 'CockroachDB', code: 'CockroachDB' },
  //   { name: 'DB2', code: 'DB2' },
  //   { name: 'Django ORM', code: 'Django ORM' },
  //   { name: 'DuckDB', code: 'DuckDB' },
  //   { name: 'DynamoDB', code: 'DynamoDB' },
  //   { name: 'Elasticsearch', code: 'Elasticsearch' },
  //   { name: 'Firestore', code: 'Firestore' },
  //   { name: 'MariaDB', code: 'MariaDB' },
  //   { name: 'MongoDB', code: 'MongoDB' },
  //   { name: 'MySQL', code: 'MySQL' },
  //   { name: 'Oracle', code: 'Oracle' },
  //   { name: 'PostgreSQL', code: 'PostgreSQL' },
  //   { name: 'Redshift', code: 'Redshift' },
  //   { name: 'Snowflake', code: 'Snowflake' },
  //   { name: 'SQL Server', code: 'SQL Server' },
  //   { name: 'SQLite', code: 'SQLite' },
  // ];

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
      <div className="flex align-items-center px-1">
        <div className="text-lg">{option.name}</div>
        <div className="ml-auto text-xs font-italic">{option.dialect}</div>
      </div>
    );
  };

  React.useEffect(() => {
    if (schema === null && !loading && appName) {
      setLoading(true);
      setLoadingMessage('Loading Schema...');
      fetchSchema(appName).then(res => {
        if (res) {
          setSchema(res);
        }
      });
      setLoading(false);
    }
  }, [appName, loading, schema]);

  const [selectSchema, setSelectSchema] = React.useState(schema?.schema[0]);
  const [showSchema, setShowSchema] = React.useState(false);

  return (
    <>
      <Helmet>
        <title>Search</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <SearchBar className="mx-auto m-5 mb-0">
        <form
          className="p-inputgroup"
          onSubmit={e => {
            e.preventDefault();
            setLoading(true);
            setLoadingMessage('Genertating Query...');
            setShowSchema(false);
            if (appName) {
              genQuery(appName, search, selectSchema.id)
                .then(res => {
                  setLoading(false);
                  setResult(res);
                })
                .catch(err => {
                  setLoading(false);
                  console.log(err);
                });
            }
          }}
        >
          <InputText
            placeholder="What's the total number of users by state?"
            className="searchInput"
            required
            onChange={e => {
              setSearch(e.currentTarget.value);
            }}
          />
          <Button
            type="submit"
            aria-label="Search"
            className="searchButton"
            icon={<BsSearch />}
            style={{ zIndex: 5 }}
          />
        </form>
        {schema?.schemas[0] && (
          <>
            <div className="flex align-items-center">
              <Dropdown
                value={selectSchema}
                onChange={e => {
                  if (e.value !== selectSchema) {
                    setSelectSchema(e.value);
                    setShowSchema(false);
                  }
                }}
                options={schema?.schemas}
                optionLabel="dialect"
                placeholder="Select a Schema"
                required
                valueTemplate={selectedDialect}
                itemTemplate={dialectOptionTemplate}
                className="w-20rem m-1 dialectSelect d-inline-block"
              />

              {selectSchema && (
                <>
                  <p
                    onClick={() => setShowSchema(!showSchema)}
                    className="text-sm cursor-pointer w-content p-1 float-right"
                    style={{
                      fontFamily: 'Open Sans',
                      width: 'max-content',
                      display: 'inline-flex',
                      marginLeft: 'auto',
                    }}
                  >
                    Preview Schema
                  </p>
                </>
              )}
            </div>
            {selectSchema && showSchema && (
              <div className="p-5 bg-gray-800 max-h-30rem overflow-auto border-round-sm">
                <code className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {`${selectSchema.schema}`}
                </code>
              </div>
            )}
          </>
        )}
      </SearchBar>
      {loading && <Grid text={loadingMessage} />}
      {!loading && result && <Query result={result} />}
    </>
  );
}
