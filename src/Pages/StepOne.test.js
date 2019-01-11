import React from 'react';
import {mount} from 'enzyme';
import StepOne from './StepOne';

describe('<StepOne />', () => {
        
    const wrapper = mount(<StepOne />);
    const input = wrapper.find('StepOne__StyledArea').first();
    const output = wrapper.find('StepOne__StyledArea').last();
    const mockInput = JSON.stringify({
        "0": [
            {
                "id": 10,
                "level": 0,
                "children": [],
                "parent_id": null
            }
        ],
        "1": [
            {
                "id": 12,
                "level": 1,
                "children": [],
                "parent_id": 10
            }
        ]
    });
    const mockOutput = JSON.stringify([
        {
            "id": 10,
            "level": 0,
            "children": [
                {
                    "id": 12,
                    "level": 1,
                    "children": [],
                    "parent_id": 10
                }
            ],
            "parent_id": null
        }
    ], null, 1);
    
    it('renders two textarea field', () => {
        expect(wrapper.find('StepOne__StyledArea')).toHaveLength(2);
    });

    it('returs nested array from JSON', () => {        
        input.simulate('change', {
            target: {
                value: mockInput
            }
        });
        expect(output.getDOMNode().value).toEqual(mockOutput);
    });

    it('handles JSON errors', () => {
        input.simulate('change', {
            target: {
                value: 'Hello'
            }
        });
        expect(output.getDOMNode().value).toEqual('Unexpected token H in JSON at position 0');
    });
});
