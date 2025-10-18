import React from 'react';

const SectionTitle = ({title, description}) => {
    return (
        <div className='pb-5'>
            <h1 className='text-2xl font-semibold pb-1'>{title}</h1>

            <p>{description}</p>
        </div>
    );
};

export default SectionTitle;