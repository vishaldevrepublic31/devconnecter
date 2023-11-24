import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  console.log('user', user)
  return (
    <section className="container">
      <h1 className="large text-primary">Dashboard</h1>
      <div style={{ marginBottom: '30px', backgroundColor: '#F3F4F7', padding: '30px', borderRadius: '5px' }}>
        <div className='dash-buttons my-bio' >
          <div>
            <img src={user?.avatar?.secure_url} alt='' className='round-img' style={{ height: "150px", width: "150px" }} />
          </div>
          <div >
            <p className="lead" style={{ color: 'black' }}>
              <i className="fas fa-user" /> Welcome {user && user.name}
            </p>
            <div style={{ display: "flex", width: "300px" }}>
              <Link to='/following' className='btn btn-light' style={{ backgroundColor: 'white' }}>
                <i className=' text-primary' /> Following: <span className='number'>{(profile && profile?.following.length) || 0}</span>
              </Link>
              <Link to='/follower' className='btn btn-light' style={{ backgroundColor: 'white' }}>
                <i className=' text-primary' /> Follower: <span className='number'>{(profile && profile?.follower.length) || 0}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>


      {profile !== null ? (
        <>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />

          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some info</p>
          <p>Please set up your profile before being granted access to all site features. </p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </>
      )}
    </section>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
