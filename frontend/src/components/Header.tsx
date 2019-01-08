import * as React from "react";
import { Navbar, Nav, NavDropdown, MenuItem, Glyphicon } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { observer } from 'mobx-react';

interface IState {
    logoutRedirect: boolean;
    profileRedirect: boolean;
}

@observer
export default class Header extends React.Component<{}, IState> {

    public componentWillMount() {
        this.setState({
            logoutRedirect: false,
            profileRedirect: false,
        });
    }
    public logout = () => {
        this.setState({
            logoutRedirect: true,
        });
    };

    public logoutRedirect() {
        if (this.state.logoutRedirect) {
            // gapi.auth2.getAuthInstance().disconnect();
            return <Redirect to="/"/>;
        }
        return null;
    }

    public openProfile = () => {
        this.setState({
            profileRedirect: true
        })
    }

    public profileRedirect() {
        if (this.state.profileRedirect) {
            return <Redirect to="/profile" />;
        }
        return null;
    }

    public render() {
        const navDropdownTitle = <Glyphicon glyph="menu-hamburger" />;

        return (
            <div>
                {this.logoutRedirect()}
                {this.profileRedirect()}
                <Navbar inverse>
                    <Navbar.Header >
                        <Navbar.Brand>
                            <a href="/movies" ><Glyphicon glyph="home" /> Movie SNApp</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight={true}>
                        <Navbar.Text>Hi, {localStorage.getItem('firstName')}!</Navbar.Text>
                        <NavDropdown title={navDropdownTitle} id="basic-nav-dropdown">
                            <MenuItem onSelect={this.openProfile}>My Profile</MenuItem>
                            <MenuItem divider />
                            <MenuItem onSelect={this.logout}>Logout</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}
