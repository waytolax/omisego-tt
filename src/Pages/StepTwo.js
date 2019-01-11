import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';
import Loader from '../Components/UI/Loader';

const Table = styled.table `
    min-width: 320px;
    box-sizing: border-box;
    background: #eee;
    border-collapse: collapse;
    border-radius: 5px;
    
    & th, td {
        padding: 10px 15px;
        border-bottom: 1px solid black;
        text-align: center;
    }
`;

const Pagination = styled.div `
    min-width: 320px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px;
    background: #eee;
    border-radius: 5px;
    
    & button {
        width: 30%;
        padding: 10px 15px;
        background: transparent;
        border: 1px solid #8c8a8a;
        border-radius: 5px;
        cursor: pointer;        
    }   
    
    & button:disabled{
        cursor: no-drop;
    }
    
    & button:nth-of-type(2){
        cursor: auto;
    }
`;

const StyledError = styled.p `
    max-width: 600px;
    margin-top: 20px;
    text-align: center;
    color: #eee;
`;

class StepTwo extends Component {

    state = {
        repos: [],
        currentPage: 1,
        links: {},
        prevLinks: [],
        loading: false,
        error: ''
    }

    componentDidMount() {
        this.fetchRepos();
    }

    async fetchRepos(rel) {
        this.setState({ loading: true });
        // Setting the url 
        let url = 'https://api.github.com/repositories';
        let prevLinks = [...this.state.prevLinks];

        if (rel === 'next') {
            url = this.state.links.next;
        }
        if (rel === 'prev' && prevLinks.length > 1) {
            url = prevLinks[prevLinks.length - 2];
            prevLinks.pop();
        }
        // Fetching repositories and getting next links from headers
        try {
            const response = await fetch(url);
            const repos = await response.json();
            if (!Array.isArray(repos)) {
                throw new Error("Recieved wrong data");
            }
            const links = this.parseHeader(response.headers.get('Link'));
            // Keeping previous links for back navigation
            if (rel === 'next' && !prevLinks.includes(this.state.links.next)) {
                prevLinks.push(this.state.links.next);
            }
            this.setState({
                repos,
                links,
                prevLinks,
                loading: false,
                error: ''
            });
        } catch (e) {
            this.setState({ error: e.message });
        }
    }
    // Parsing links from headers
    parseHeader(header) {
        if (!header) {
            throw new Error("Connection Error, please try again later");
        }
        // Split parts by comma
        const parts = header.split(',');
        const links = {};
        // Parse each part into a named link
        for (let i = 0; i < parts.length; i++) {
            const section = parts[i].split(';');
            if (section.length !== 2) {
                throw new Error("section could not be split on ';'");
            }
            const url = section[0].replace(/<(.*)>/, '$1').trim();
            const name = section[1].replace(/rel="(.*)"/, '$1').trim();
            links[name] = url;
        }
        return links;
    }
    // Getting 10 current repositories
    getCurrentRepos() {
        const from = ((this.state.currentPage - 1) % 10) * 10;
        const to = (this.state.currentPage % 10) * 10 || 100;
        return this.state.repos.filter((repo, i) => i >= from && i < to);
    }

    renderCurrentRepos() {
        return this.getCurrentRepos().map(repo => (
            <tr key={repo.id}>
                <td>{repo.owner.login}</td>
                <td>{repo.id}</td>
                <td>{repo.name}</td>
            </tr>
        ))
    }

    nextPage = () => {
        if (!(this.state.currentPage % 10)) {
            this.fetchRepos('next');
        }
        this.setState({ currentPage: this.state.currentPage + 1 });
    }

    prevPage = () => {
        if (!((this.state.currentPage - 1) % 10)) {
            this.fetchRepos('prev');
        }
        this.setState({ currentPage: this.state.currentPage - 1 });
    }

    render() {
        return (
            <div> 
                <NavLink to='/stepone' className='navigation'>Step One</NavLink>
                {
                    this.state.loading 
                        ? <Loader/> 
                        : <Table>
                            <tbody>
                                <tr>
                                    <th>Author</th>
                                    <th>Repo id</th>
                                    <th>Repo name</th>
                                </tr>
                                { this.renderCurrentRepos() }
                            </tbody>
                        </Table>
                }

                <Pagination>
                    <button 
                        onClick={this.prevPage}
                        disabled={this.state.currentPage === 1 || this.state.loading} 
                    >Prev</button>
                    <button disabled>{this.state.currentPage}</button>
                    <button 
                        onClick={this.nextPage}
                        disabled={this.state.loading}
                    >Next</button>
                </Pagination>

                { this.state.error && <StyledError>{this.state.error}</StyledError> }

            </div>
        );
    }
}

export default StepTwo;