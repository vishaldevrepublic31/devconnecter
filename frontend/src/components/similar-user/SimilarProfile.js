import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ProfileItem from '../profiles/ProfileItem';

function SimilarProfile() {

    const token = localStorage.getItem('token');
    const [profiles, setProfiles] = useState([]);
    const [reload, setReload] = useState(false);


    const [filters, setFilters] = useState({ name: '', skill: '', location: '' });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    console.log("->", filters);
    const uniqueLocations = [...new Set(profiles.map((profile) => profile.location))];

    async function profile() {

        const res = await axios.get(`http://localhost:5000/api/profile/similar-skills`, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });
        setProfiles(res.data);
        console.log(res.data)

    }

    useEffect(() => {
        profile();
        // eslint-disable-next-line
    }, [reload])
    return (
        <section className="container">

            <h1 className="large text-primary">Any one skill similar to you</h1>
            <div>
                <input
                    type="text"
                    className='m-1 p-1'
                    name="name"
                    placeholder="Search by Name"
                    value={filters.name}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="skill"
                    className='m-1 p-1'
                    placeholder="Search by Skill"
                    value={filters.skill}
                    onChange={handleFilterChange}
                />
                <select
                    name="location"
                    className='m-1 p-1'
                    value={filters.location}
                    onChange={handleFilterChange}
                >
                    <option value="">-- Select Location --</option>
                    {uniqueLocations.map((location, index) => (
                        <option key={index} value={location}>
                            {location}
                        </option>
                    ))}
                </select>
            </div>
            <div className="profiles ">
                {profiles.length > 0 ? (
                    profiles
                        .filter((profile) => {
                            const nameMatch = profile.user.name.toLowerCase().includes(filters.name.toLowerCase());
                            const skillMatch = profile.skills.some((skill) =>
                                skill.toLowerCase().includes(filters.skill.toLowerCase())
                            );
                            const locationMatch = filters.location === '' || profile.location.toLowerCase() === filters.location.toLowerCase();
                            return nameMatch && skillMatch && locationMatch;
                        })
                        .map((profile) => <ProfileItem key={profile._id} profile={profile} profileId={profile._id} setReload={setReload} reload={reload} />)
                ) : (
                    <h4>No profiles found...</h4>
                )}
            </div>
        </section>
    );
}

export default SimilarProfile
