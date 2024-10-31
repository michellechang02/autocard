import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { BookOpen } from 'react-feather';

const Navbar2: React.FC = () => {
  return (
    <Navbar>
      <NavbarBrand>
      <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300">
        <BookOpen className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
      
      <h2
        className="ml-2 font-bold font-3xl"
      >
        AutoCard
      </h2>
    </div>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>
          <Button as={Link} color="warning" href="/" variant="flat">
            Create
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="warning" href="/cards" variant="flat">
            Review
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Navbar2;