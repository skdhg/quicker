import React from "react";

export const DatabaseContext = React.createContext<{
  database: { url: string; type: string };
  setDatabase: (database: { url: string; type: string }) => void;
}>({
  database: {
    url: "",
    type: "",
  },
  setDatabase: () => {},
});

export function useDatabase() {
  const context = React.useContext(DatabaseContext);

  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }

  return context;
}

export const DatabaseProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [database, setDatabase] = React.useState({
    url: "",
    type: "",
  });

  return (
    <DatabaseContext.Provider
      value={{
        database,
        setDatabase,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
