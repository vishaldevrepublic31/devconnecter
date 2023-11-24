import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getCurrentProfile, getProfiles } from '../../actions/profile';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  const [reload, setReload] = useState(false);

  const dispatch = useDispatch()
  useEffect(() => {
    getProfiles();
  }, [getProfiles, reload]);

  // useEffect(() => {
  //   dispatch(getCurrentProfile());
  // }, []);

  const [filters, setFilters] = useState({ name: '', skill: '', location: '' });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };



  // Create an array of unique locations from profiles
  const uniqueLocations = [...new Set(profiles.map((profile) => profile.location))];

  return (
    <section className="container">
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" /> Browse and connect with developers
          </p>
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
        </Fragment>
      )}
    </section>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
