import locationsInstanse, { Locations } from "../locations";
import { formatDate } from "../../helpers/date";
import api, { Api } from "../../services/apiService";

const countries = [{ code: "UKR", name: "Ukraine" }];
const cities = [
  {
    country_code: "UKR",
    name: "Kharkiv",
    code: "KH",
    full_name: "Kharkiv,Ukraine",
  },
];
const airlines = [{ country_code: "UKR", name: "Airlines", code: "AVIA" }];

jest.mock("../../services/apiService", () => {
  const mockApi = {
    countries: jest.fn(() =>
      Promise.resolve([{ code: "UKR", name: "Ukraine" }])
    ),
    cities: jest.fn(() =>
      Promise.resolve([
        {
          country_code: "UKR",
          name: "Kharkiv",
          code: "KH",
          full_name: "Kharkiv,Ukraine",
        },
      ])
    ),
    airlines: jest.fn(() =>
      Promise.resolve([{ country_code: "UKR", name: "Airlines", code: "AVIA" }])
    ),
  };

  return {
    Api: jest.fn(() => mockApi),
  };
});

const apiService = new Api();

describe("Locations store tests", () => {
  beforeEach(() => {
    locationsInstanse.countries = locationsInstanse.serializeCountries(
      countries
    );
    locationsInstanse.cities = locationsInstanse.serializeCountries(cities);
  });

  it("Check that locationInstance is instance of locations class", () => {
    expect(locationsInstanse).toBeInstanceOf(Locations);
  });
  it("Success Locations instance create", () => {
    const instance = new Locations(api, { formatDate });
    expect(instance.countries).toBe(null);
    expect(instance.cities).toBe(null);
    expect(instance.shortCitiesList).toEqual({});
    expect(instance.lastSearch).toEqual({});
    expect(instance.airlines).toEqual({});
    expect(instance.formatDate).toEqual(formatDate);
  });
  it("Check correct init method call", () => {
    const instance = new Locations(apiService, { formatDate });
    expect(instance.init()).resolves.toEqual([countries, cities, airlines]);
  });
  it("Check correct get city by key", () => {
    const res = locationsInstanse.getCityCodeByKey("Kharkiv,Ukraine");
    expect(res).toBe("KH");
  });
  it("Check correct get city by code", () => {
    const res = locationsInstanse.getCityNameByCode("KH");
    expect(res).toBe("Kharkiv");
  });
  it("Check correct countries serialize", () => {
    const res = locationsInstanse.serializeCountries(countries);
    const expectedData = {
      UKR: { code: "UKR", name: "Ukraine" },
    };
    expect(res).toEqual(expectedData);
  });
  it("Check countries serialize with incorrect data", () => {
    const res = locationsInstanse.serializeCountries(null);
    const expectedData = {};
    expect(res).toEqual(expectedData);
  });
  it("Check correct cities serialize", () => {
    const res = locationsInstanse.serializeCities(cities);
    const expectedData = {
      KH: {
        country_code: "UKR",
        name: "Kharkiv",
        code: "KH",
        country_name: "Ukraine",
        full_name: "Kharkiv,Ukraine",
      },
    };
    expect(res).toEqual(expectedData);
  });
});
