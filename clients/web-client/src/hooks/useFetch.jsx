import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const { keycloak } = useKeycloak();

  useEffect(() => {
    axios.get(url, {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${keycloak?.token}`,
        }
      })
      .then((res) => setData(res.data))
      .catch(error => console.error("Error fetching grades:", error))
  }, [keycloak?.token, url]);

  return data;
};

export default useFetch;