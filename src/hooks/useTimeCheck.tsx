// import { useState, useEffect } from "react";

// const useTimeCheck = () => {
//   const [isBeforeDeadline, setIsBeforeDeadline] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "https://worldtimeapi.org/api/timezone/America/Sao_Paulo"
//         );
//         const data = await response.json();

//         if (response.ok) {
//           const utcDatetime = new Date(data.utc_datetime);

//           utcDatetime.setTime(utcDatetime.getTime() - 3 * 60 * 60 * 1000);

//           const deadlineDatetime = new Date("2026-10-20T23:59:59Z");

//           setIsBeforeDeadline(utcDatetime <= deadlineDatetime);
//         } else {
//           setIsBeforeDeadline(false);
//         }
//       } catch (error) {
//         alert("Erro na requisição de hora do servidor");
//         setIsBeforeDeadline(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return isBeforeDeadline;
// };

// export default useTimeCheck;
