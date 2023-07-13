import { useEffect, useState } from "react";

export function useSettingsBucket<T extends Record<string, string>>(
  initialValues: T
) {
  const [loading, setLoading] = useState(true);
  const [currentInitialValues, setCurrentInitialValues] =
    useState<T>(initialValues);

  useEffect(() => {
    setLoading(true);

    // define function to get the initial values out of the database
    const getInitialValues = async (): Promise<T> => {
      // get the keys of the initial values
      const valuesKeys = Object.keys(initialValues);

      // create the default initialvalues
      const newInitialValues = initialValues;

      // loop over keys and get the values
      await Promise.all(
        valuesKeys.map(async (k) => {
          // @ts-ignore
          newInitialValues[k as keyof T] =
            (await window.rumor.methods.getSetting(k)) || "";
        })
      );

      // return the fetched initial values
      return newInitialValues;
    };

    // get the initial values
    getInitialValues().then((v) => {
      setCurrentInitialValues(v);
      setLoading(false);
    });
  }, []);

  const saveValues = async (values: T) => {
    // get all the values keys
    const valuesKeys = Object.keys(values);

    // save everything in the form
    await Promise.all(
      valuesKeys.map(async (vk: string) => {
        await window.rumor.actions.saveSetting({
          key: vk,
          value: values[vk as keyof T] ?? "",
        });
      })
    );
  };

  return { loading, currentInitialValues, saveValues };
}
