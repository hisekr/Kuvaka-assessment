import axios from "axios";

export const fetchCountries = async () => {
  const res = await axios.get(
    "https://restcountries.com/v3.1/all?fields=name,idd"
  );
  return res.data
    .map((c) => ({
      name: c.name.common,
      code:
        c.idd?.root && c.idd?.suffixes?.length
          ? `${c.idd.root}${c.idd.suffixes[0]}`
          : "",
    }))
    .filter((c) => c.code)
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
};
