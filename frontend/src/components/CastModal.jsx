import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/CastModal.css";

function CastModal({ cast, showModal, closeModal }) {
  const [castDetails, setCastDetails] = useState(null);
  const [loading, setLoading] = useState(true); // To track loading state
  useEffect(() => {
    if (cast) {
      fetchCastDetails();
    }
    return () => {
      setCastDetails(null); // Reset cast details when the modal is closed or when cast changes
      setLoading(true); // Reset loading state
    };
  }, [cast]);

  const fetchCastDetails = async () => {
    const myApiKey = "23f11857def64e1cc0dc66c09692b2a7";
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/person/${cast.id}?api_key=${myApiKey}`
      );
      setCastDetails({
        ...response.data,
        birthday: response.data.birthday
          ? new Date(response.data.birthday).toDateString()
          : "Unknown",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cast details:", error);
      setLoading(false);
    }
  };

  if (!castDetails) return null; // Return null if no cast details are available

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div
            className="modal-header"
            style={{ backgroundColor: "#e50914", color: "white" }}
          >
            <h5 className="modal-title" id="exampleModalLabel">
              {castDetails.name}
            </h5>
            <span className="x-close" aria-hidden="true" onClick={closeModal}>
              &times;
            </span>
          </div>
          <div className="modal-body">
            {castDetails.profile_path && (
              <center>
              <img
                className="profile-pic"
                src={`https://image.tmdb.org/t/p/w500/${castDetails.profile_path}`}
                alt={castDetails.name}
                style={{
                  width: "250px",
                  height: "400px",
                  borderRadius: "10px",
                }}
              /></center>
            )}
            <div style={{ marginLeft: "20px", color: "black", marginTop: "20px" }}>
              <p>
                <strong>Birthday:</strong> {castDetails.birthday}
              </p>
              <br />
              <p>
                <strong>Place of Birth:</strong>{" "}
                {castDetails.place_of_birth || "Unknown"}
              </p>
              <br />
              <p>
                <strong>Biography:</strong>
              </p>
              <p>{castDetails.biography || "No biography available."}</p>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CastModal;





// function CastModal({ cast, showModal, closeModal }) {
//   if (!cast || !cast.cast_bdays || !cast.cast_bios || !cast.cast_places) return null; // Return null if any required data is missing

//   // Assuming all arrays have the same length
//   const castDetails = cast.cast_bdays.map((birthday, index) => ({
//     birthday,
//     biography: cast.cast_bios[index],
//     place_of_birth: cast.cast_places[index],
//   }));

//   return (
//     <div
//       className={`modal fade ${showModal ? 'show' : ''}`}
//       tabIndex="-1"
//       role="dialog"
//       aria-labelledby="exampleModalLabel"
//       aria-hidden="true"
//       style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
//     >
//       <div className="modal-dialog modal-lg" role="document">
//         <div className="modal-content">
//           <div className="modal-header" style={{ backgroundColor: '#e50914', color: 'white' }}>
//             <h5 className="modal-title" id="exampleModalLabel">
//               Cast Details
//             </h5>
//             <span className="x-close" aria-hidden="true" onClick={closeModal} style={{ cursor: 'pointer' }}>
//               &times;
//             </span>
//           </div>

//           <div className="modal-body">
//             {castDetails.map((detail, index) => (
//               <div key={index} style={{ display: 'flex', marginBottom: '20px' }}>
//                 {cast.profile && (
//                   <img
//                     className="profile-pic"
//                     src={cast.profile}
//                     alt={cast.name || 'Profile'}
//                     style={{ width: '250px', height: '400px', borderRadius: '10px' }}
//                   />
//                 )}
//                 <div style={{ marginLeft: '20px', color: 'black' }}>
//                   <p>
//                     <strong>Birthday:</strong> {detail.birthday}
//                   </p>
//                   <p>
//                     <strong>Place of Birth:</strong> {detail.place_of_birth}
//                   </p>
//                   <p>
//                     <strong>Biography:</strong>
//                   </p>
//                   <p>{detail.biography}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="modal-footer">
//             <button type="button" className="btn btn-secondary" onClick={closeModal}>
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

  
  // export default CastModal;
  


// function CastModal({ cast, showModal, closeModal }) {
//   if (!cast) return null; // Return null if no cast details are available

//   return (
//     <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
//       <div className="modal-dialog modal-lg" role="document">
//         <div className="modal-content">
//           <div className="modal-header" style={{ backgroundColor: '#e50914', color: 'white' }}>
//             <h5 className="modal-title" id="exampleModalLabel">{cast.name}</h5>
//             <span className="x-close" aria-hidden="true" onClick={closeModal}>&times;</span>
//           </div>
//           <div className="modal-body">
//             {cast.profile && (
//               <img className="profile-pic" src={cast.profile} alt={cast.name} style={{ width: '250px', height: '400px', borderRadius: '10px' }} />
//             )}
//             <div style={{ marginLeft: '20px', color: "black", marginTop: '20px' }}>
//               <p><strong>Birthday:</strong> {cast.birthday} </p>
//               <br />
//               <p><strong>Place of Birth:</strong> {cast.place_of_birth} </p>
//               <br />
//               <p><strong>Biography:</strong></p>
//               <p>{cast.biography}</p>
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CastModal;



