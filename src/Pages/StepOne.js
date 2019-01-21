import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';

const StyledArea = styled.textarea `
    width: 45%;
    box-sizing: border-box;
    padding: 20px;
    background: #eee;
    border-radius: 5px;
    box-shadow: 2px 2px 2px rgba(0,0,0,.5);
    color: ${props => props.error && 'red'};
`;

class StepOne extends Component {

    state = {
        output: '',
        error: ''
    };

    changeHandler = (event) => {
        // Parsing json to flat and sorted by level array
        try {
            const input = JSON.parse(event.target.value);
            const sortedInput = Object.keys(input)
                .map(key => input[key])
                .flat()
                .sort((a, b) => b.level - a.level);
            // Getting max depth of nesting
            let maxDepth = Math.max.apply(Math, sortedInput.map(i => i.level));
            // Pushing children in their parents
            const output = sortedInput.reduce((acc, currentItem) => {
                if (currentItem.level <= maxDepth && currentItem.parent_id) {
                    const parent = sortedInput.filter(i => i.id === currentItem.parent_id);

                    if (!parent.length)
                        throw new Error(`There is no parent for "${currentItem.title}"`);
                    if (!parent[0].children)
                        throw new Error(`"${parent[0].title}" can't have children`);

                    parent[0].children.push(currentItem);
                    return parent;
                } else {
                    maxDepth--;
                }
                return acc;
            }, [...sortedInput]);

            this.setState({
                output: JSON.stringify(output, null, 1),
                error: ''
            });
        } catch (e) {
            event.target.value 
            ? this.setState({ error: e.message }) 
            : this.setState({ error: '' });
        }
    }

    render() {
        return (
            <React.Fragment>
                <NavLink to='/steptwo' className='navigation'>Step Two</NavLink>
                <StyledArea 
                    onChange={this.changeHandler} 
                    placeholder='Enter JSON here'
                />
                <StyledArea 
                    value={this.state.error || this.state.output} 
                    error={this.state.error} 
                    readOnly
                />
            </React.Fragment>
        );
    }
}

export default StepOne;