import React from 'react';
import './Layout.css'; // Make sure to create a corresponding CSS file for styling
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
// Define props for Layout, allowing it to receive children elements
type LayoutProps = {
    children: React.ReactNode;
};

// Layout component
const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
