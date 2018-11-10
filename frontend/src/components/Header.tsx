import * as React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';

export default class Header extends React.Component<{ history?: any }>{


    public logout=() => {
        this.props.history.push("/");
    }
    public render() {
        const navDropdownTitle = (<Glyphicon glyph="menu-hamburger" />);
        return (
            <div>
                <Navbar inverse>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/movies">Ime aplikacije</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight={true}>
                        <Navbar.Text>
                            Hi, user!
                        </Navbar.Text>
                        <NavDropdown title={navDropdownTitle} id="basic-nav-dropdown">
                            <MenuItem >My Profile</MenuItem>
                            <MenuItem >Select genres</MenuItem>
                            <MenuItem divider />
                            <MenuItem onSelect={this.logout}>Logout</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </div>
        );
    }
}

