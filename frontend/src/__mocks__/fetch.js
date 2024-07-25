// src/__mocks__/fetch.js
export default jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]),
    })
);
