import React from 'react';
import { Outlet } from 'react-router-dom';
import InsuranceSidebar from './InsuranceSidebar';
import Header from './Header';
import { MobileMenuProvider, useMobileMenu } from '../context/MobileMenuContext';

const MainContent: React.FC = () => {
    const { isMenuOpen, toggleMenu } = useMobileMenu();

    return (
        <div className="flex h-screen bg-dark-background">
            <InsuranceSidebar />
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
                    onClick={toggleMenu}
                ></div>
            )}
            <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const InsuranceProtectedLayout: React.FC = () => {
    return (
        <MobileMenuProvider>
            <MainContent />
        </MobileMenuProvider>
    );
};

export default InsuranceProtectedLayout;
