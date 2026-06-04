type UserStatsProps = {
    followerCount?: number;
    followingCount?: number;
    fetchFollowersList: () => void;
    fetchFollowingsList: () => void;
}

const UserStats = (props: UserStatsProps) => {
    return (
        <div className="profile-stats-container" >
            <div
                id="followersStat"
                className="profile-stat-item"
                onClick={props.fetchFollowersList}>

                <b className="profile-stat-count">{props.followerCount}</b>
                <span className="profile-stat-label">دنبال‌کننده</span>
            </div>
            <div
                id="followingsStat"
                className="profile-stat-item"
                onClick={props.fetchFollowingsList}>

                <b className="profile-stat-count">{props.followingCount}</b>
                <span className="profile-stat-label">دنبال‌شونده</span>
            </div>
        </div>
    );
};

export default UserStats;