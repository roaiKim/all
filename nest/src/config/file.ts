// import { join } from "path";
// import { diskStorage } from 'multer';
// import { v4 as uuidv4 } from 'uuid';
// import { Base64 } from 'js-base64';

// export default {
//     root: join(__dirname, '../uploads'),
//     storage: diskStorage({
//       destination: join(__dirname, `../uploads/${new Date().toLocaleDateString()}`),
//       filename: (req, file, cb) => {
//           try {
//             const origin = file.originalname.split('.');
//             if (file.mimetype.startsWith("image/")) {
//               const filename = `${uuidv4().replace(/-/g, "")}-${Base64.encodeURL(origin[0])}.${origin[origin.length - 1]}`;
//               return cb(null, filename);
//             } else {
//               console.log(file)
//               const filename = `${origin.slice(0, -1).join("")}-${uuidv4().replace(/-/g, "")}.${origin[origin.length - 1] || ""}`;
//               return cb(null, filename);
//             }
//           } catch {
//             const filename = `${uuidv4()}-${file.originalname}}`;
//             return cb(null, filename);
//           }
//       },
//     }),
//     fileFilter: (req, file, cb) => {
//       console.log("-fileFilter--fileFilter", file)
//     }
// };
