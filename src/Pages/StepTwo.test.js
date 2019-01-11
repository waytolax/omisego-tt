import React from 'react';
import { shallow } from 'enzyme';
import StepTwo from './StepTwo';

describe('<StepTwo />', () => {

    it('renders Loader if there is no data or loading', () => {
        const wrapper = shallow(<StepTwo />);
        expect(wrapper.find('Loader')).toHaveLength(1);
    });

    it('handles fetch errors and shows error message', done => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(new Error("Failed to load")));
        const wrapper = shallow(<StepTwo />);

        process.nextTick(() => {
            const errorBlock = wrapper.find('StepTwo__StyledError');
            expect(errorBlock).toHaveLength(1);
            expect(errorBlock.text()).toEqual('Failed to load');

            global.fetch.mockClear();
            done();
        });
    });

    it('fetches data from api and render it into the table', done => {
        const mockResponseData = [{
            "id": 1,
            "name": "hello",
            "owner": {
                "login": "world"
            }
        }];
        const mockResponseLinks = '<https://api.github.com/>; rel="first"';
        const mockSuccessState = {
            "currentPage": 1,
            "error": "",
            "links": {
                "first": "https://api.github.com/"
            },
            "loading": false,
            "prevLinks": [],
            "repos": [{
                "id": 1,
                "name": "hello",
                "owner": {
                    "login": "world"
                }
            }]
        }
        const mockJsonPromise = Promise.resolve(mockResponseData);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
            headers: {
                get: jest.fn(() => mockResponseLinks)
            }
        });
        
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
        const wrapper = shallow(<StepTwo />);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith('https://api.github.com/repositories');

        process.nextTick(() => {
            expect(wrapper.state()).toEqual(mockSuccessState);
            expect(wrapper.find('Loader')).toHaveLength(0);
            expect(wrapper.find('tr')).toHaveLength(2);

            global.fetch.mockClear();
            done();
        });
    });
});