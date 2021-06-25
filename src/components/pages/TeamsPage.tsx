import React from 'react';
import { Helmet } from 'react-helmet';

export default function TeamsPage() {
    const getTeamsPage = () => {
        return (
            <div>
                <h1>Teams</h1>
            </div>
        );
    };

    return (
        <div>
            <Helmet title={'Starsky | Teams'} />
            {getTeamsPage()}
        </div>
    );
}
