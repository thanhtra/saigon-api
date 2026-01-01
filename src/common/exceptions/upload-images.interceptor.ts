import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { resolveUploadPath } from '../helpers/upload';
import { ensureDir } from '../helpers/utils';


export const UploadImagesInterceptor = FilesInterceptor('files', 20, {
    storage: diskStorage({
        destination: (req, _file, cb) => {
            try {
                const { uploadPath } = resolveUploadPath(req.body);
                ensureDir(uploadPath);
                cb(null, uploadPath);
            } catch (err) {
                cb(err, null);
            }
        },
        filename: (_, file, cb) => {
            cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
    }),
    fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
            return cb(new Error('Chỉ chấp nhận hình ảnh'), false);
        }
        cb(null, true);
    },
});
