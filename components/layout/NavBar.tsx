'use client';

import { useAuth, UserButton } from "@clerk/nextjs";
import Container from "../Container";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SearchInput from "../Searchinput";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from '../theme-toggle';
import { NavMenu } from "./NavMenu";


const NavBar = () => {
   const router = useRouter()
   const {userId} = useAuth ();
    return (
        <div className="sticky top-0 border border-b-primary/10 bg-secondary">
            <Container>
                <div className="flex justify-between items-center">
                <div className="flex items-center gap-1
                cursor-pointer" onClick={() => router.push('/')}>
                    <Image 
                        src='/logo.jpg' 
                        alt="logo" 
                        width='30' 
                        height='30' 
                    />

                    <div className="font-bold
                    text-xl">Cozy Homes</div>
                </div>

                <SearchInput />
                <div className="flex gap-3 items-center">

                <div>
                    <ModeToggle/>
                    <NavMenu/>
                    </div>

                <UserButton afterSignOutUrl="/" />
                {!userId && <>
                <Button  onClick={() => router.push('/sign-in')}
                  variant='outline' size='sm'>Sign in</Button>
                <Button onClick={() => router.push('/sign-up')}
                  size='sm'>Sign up</Button>
                    </>}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default NavBar;