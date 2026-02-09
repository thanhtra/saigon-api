import { join } from 'path';
import { UploadDomain } from './enum';


export const UPLOAD_ROOT = join(process.cwd(), 'uploads');

export const UPLOAD_DOMAIN_ID_FIELD: Record<UploadDomain, string> = {
    [UploadDomain.Rooms]: 'room_id',
    [UploadDomain.Lands]: 'land_id',
    [UploadDomain.Contracts]: 'contract_id',
};


export function resolveUploadPath(
    body: any,
): {
    uploadPath: string;
    entityId: string;
    entityField: 'room_id' | 'land_id' | 'contract_id';
} {

    const domain = body.domain as UploadDomain;
    const idField = UPLOAD_DOMAIN_ID_FIELD[domain];

    if (!idField) {
        throw new Error('Invalid upload domain');
    }

    const entityId = body[idField];
    if (!entityId) {
        throw new Error(`${idField} is required for domain ${domain}`);
    }

    const uploadPath = join(
        process.cwd(),
        'uploads',
        domain,
        entityId,
    );

    return {
        uploadPath,
        entityId,
        entityField: idField as 'room_id' | 'land_id' | 'contract_id',
    };
}

