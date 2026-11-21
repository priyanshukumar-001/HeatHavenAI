/**
 * UserLocation Marker View (Rendered inside Leaflet DivIcon)
 * Displays pulsing blue ring according to SPEC Section 6
 */
export const UserLocationIconHtml = `
  <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
    <span class="animate-pulse-ring" style="position: absolute; width: 30px; height: 30px; border-radius: 999px; background: rgba(15, 111, 168, 0.4); border: 1.5px solid rgba(15, 111, 168, 0.6);"></span>
    <span style="position: relative; width: 15px; height: 15px; border-radius: 999px; background: #0F6FA8; border: 2.5px solid #FFFFFF; box-shadow: 0 3px 10px rgba(15, 111, 168, 0.5);"></span>
  </div>
`;

export default UserLocationIconHtml;
