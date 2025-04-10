import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../helper/supabaseClient";
import "../styles/searchbar.css";
import { FaSearch } from "react-icons/fa";

const DEFAULT_AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ0FpBg5Myb9CQ-bQpFou9BY9JXoRG6208_Q&s";

function UserSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, full_name, avatar")
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`);

      if (error) {
        console.error("Search error:", error);
        return;
      }

      const uniqueResults = data.filter(
        (user, index, self) => index === self.findIndex((u) => u.id === user.id)
      );

      setResults(uniqueResults);
      setShowDropdown(true);
    };

    fetchResults();
  }, [query]);

  const handleSelectUser = (userId) => {
    setQuery("");
    setShowDropdown(false);
    navigate(`/profile/${userId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelectUser(results[0].id);
    }
  };

  return (
    <div className="user-search-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="user-search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-button" title="Search">
          <FaSearch />
        </button>
        {showDropdown && (
          <div className="user-search-results">
            {results.length === 0 ? (
              <div className="no-results">No users found.</div>
            ) : (
              results.map((user) => (
                <div
                  key={user.id}
                  className="user-result-card"
                  onClick={() => handleSelectUser(user.id)}
                >
                  <img src={user.avatar || DEFAULT_AVATAR} alt="Avatar" />
                  <div>
                    <strong>{user.username}</strong>
                    <div className="user-full-name">{user.full_name}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default UserSearchBar;
