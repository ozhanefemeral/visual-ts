const dummyData = `async function generatedFunction() { 
  let fetchdata = await fetchData();
  let fetchextradata = await fetchExtraData();
  let parsedata =  parseData();
}`;

describe("dummy test for 'packages/code-generator'", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});
