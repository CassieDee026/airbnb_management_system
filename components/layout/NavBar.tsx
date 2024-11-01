'use client'

import { UserButton } from "@clerk/nextjs";
import Container from "../Container";

const NavBar = () => {
    return (
        <div className="sticky top-0 border
        border-b-primary/10 bg-secondary">
            <Container>
             <UserButton afterSignOutUrl="/"/>
            </Container>
        </div>
    );
}

export default NavBar;