import fs from "fs";
import formidable from "formidable";
import { parse } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { createTextbook } from "@/lib/api/textbooks/routes";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to check file extension
function checkExtension(filename, extensions) {
  return extensions.some((ext) => filename.toLowerCase().endsWith(ext));
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const cookies = parse(req.headers.cookie || "");
    const accessToken = cookies["access_token"];

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const form = formidable({});
    let fields, files;
    try {
      const parsed = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      fields = parsed.fields;
      files = parsed.files;
    } catch (err) {
      console.error(err);
      res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
      res.end(String(err));
      return;
    }

    // Create a FormData instance to hold the fields and files

    let file = new Blob([]);
    let image_file = new Blob([]);

    // Check file extension and MIME type for 'file'
    if (files.file) {
      const fileExt = [".pdf", ".docx", ".doc"];
      const fileMimeTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];

      if (
        !checkExtension(files.file[0].originalFilename, fileExt) ||
        !fileMimeTypes.includes(files.file[0].mimetype)
      ) {
        return res
          .status(400)
          .json({
            error:
              "Invalid file format for 'file'. Only .pdf, .docx, .doc are allowed.",
          });
      }

      const fileStream = fs.readFileSync(files.file[0].filepath);
      const b = new Blob([fileStream], { type: files.file[0].mimetype });
      file = b;
    }

    // Check file extension and MIME type for 'image_file'
    if (files.image_file) {
      const imageExt = [".jpg", ".jpeg", ".png"];
      const imageMimeTypes = ["image/jpeg", "image/png"];

      if (
        !checkExtension(files.image_file[0].originalFilename, imageExt) ||
        !imageMimeTypes.includes(files.image_file[0].mimetype)
      ) {
        return res
          .status(400)
          .json({
            error:
              "Invalid image format for 'image_file'. Only .jpg, .jpeg, .png are allowed.",
          });
      }

      const imageFileStream = fs.readFileSync(files.image_file[0].filepath);
      const i = new Blob([imageFileStream], {
        type: files.image_file[0].mimetype,
      });
      image_file = i;
    }

    // Make the API call with formData
    try {
      const response = await createTextbook(
        accessToken,
        fields.title[0],
        fields.nickname[0],
        { file, filename: files.file[0].originalFilename },
        { file: image_file, filename: files.image_file[0].originalFilename }
      ); // Ensure createTextbook can handle FormData
      console.log(response);
      res.status(200).json({ success: true, response });
    } catch (apiError) {
      console.error(apiError);
      res.status(500).json({ error: "Error calling createTextbook API" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
