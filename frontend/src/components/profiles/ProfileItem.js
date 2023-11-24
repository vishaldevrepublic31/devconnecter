import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { getCurrentProfile, getProfiles } from '../../actions/profile';

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    company,
    location,
    skills,
  },
  profileId,
  setReload,
  reload,
}) => {
  const [following, setFollowing] = useState([]);
  const dispatch = useDispatch();
  const auth = useSelector(state => state?.auth?.user?._id)
  useEffect(() => {
    userProfileLoad();
  }, [reload]);


  const token = localStorage.getItem('token');

  const handleFollow = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/profile/follow/${id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });
      setReload(!reload);
      userProfileLoad();
      dispatch(getProfiles());
      dispatch(getCurrentProfile());
    } catch (err) {
      console.log(err)
    }
  };

  const handleUnFollow = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/profile/unfollow/${id}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });
      setReload(!reload);
      userProfileLoad();
      dispatch(getProfiles());
      dispatch(getCurrentProfile());
    } catch (err) {
      console.log(err)
    }
  };

  async function userProfileLoad() {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:5000/api/profile/me`, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });
    setFollowing(res.data.following);
  }
  // const loggedInUserProfile = auth !== _id
  return (
    <div className='profile bg-light'>
      <img src={avatar.secure_url} alt='' className='round-img' />
      <div>
        <h2>{name}</h2>
        <p>
          {status} {company && <span> at {company}</span>}
        </p>
        <p className='my-1'>{location && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
        <Link to={`/chat/${_id}`} className='btn btn-primary'>
          Chat me
        </Link>
        {auth !== _id && <> {following.some((item) => item._id === profileId) ? (
          <button onClick={() => handleUnFollow(_id)} className='btn btn-primary'>
            Unfollow
          </button>
        ) : (
          <button onClick={() => handleFollow(_id)} className='btn btn-primary'>
            Follow
          </button>
        )}</>}
      </div>
      <ul>
        {skills.slice(0, 4).map((skill, index) => (
          <li key={index} className='text-primary'>
            <i className='fas fa-check' /> {skill}
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileItem;
