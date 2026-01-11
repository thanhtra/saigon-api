import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { forOwn } from 'lodash';
import * as moment from 'moment';
import { promisify } from 'util';
import { PERMISSIONS } from '../../config/permissions';
import { UserRole } from './enum';

import * as fs from 'fs';
import * as path from 'path';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';



export const PHONE_REGEX = /^(0)(3|5|7|8|9)[0-9]{8}$/;


export function ellipsis(text: string, length: number) {
  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length) + '...';
}

/**
 * Returns a random number between min (inclusive) and max (inclusive)
 */
export function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Returns true if the user is admin
 */
export function userIsAdmin(user) {
  return user.roles.includes(UserRole.Admin);
}

/**
 * Returns true if the user is a Sales Engineer Manager
 */
export function userIsSeManager(user) {
  return user.roles.includes(UserRole.Admin);
}


/**
 * Returns a base64-encoded encryption key, based on a given password
 * @param password
 * @returns string
 */
export async function generateEncryptionKey(password) {
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  return key.toString('base64');
}

/**
 * Encrypts a string using an AES algorithm. Note: a null/empty value will be returned as-is (without encryption).
 * @param textToEncrypt the text to encrypt
 * @param key the secret/private key to use
 * @returns encrypted string
 */
export function encrypt(textToEncrypt, key) {
  if (textToEncrypt === null || textToEncrypt === '') {
    return textToEncrypt;
  }

  let iv = randomBytes(16);

  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);

  return iv.toString('base64') + '.' + encryptedText.toString('base64');
}

/**
 * Decrypts a string with the provided key. Note: a null/empty value will be returned as-is (without decryption).
 * @param textToDecrypt the text to decrypt
 * @param key the secret/private key to use
 * @returns decrypted string/object
 */
export function decrypt(textToDecrypt, key): string {
  if (textToDecrypt === null || textToDecrypt === '') {
    return textToDecrypt;
  }

  const [iv, encryptedText] = textToDecrypt
    .toString()
    .split('.')
    .map((str) => Buffer.from(str, 'base64'));

  const decipher = createDecipheriv('aes-256-ctr', key, iv);
  let decryptedText = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]).toString('utf-8');

  return decryptedText;
}

/**
 * Tests if a string can be parsed in JSON
 * @param str a string
 * @returns boolean
 */
export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Maps a function to all items in an object (equivalent to the Array map function)
 * @param obj the object to map
 * @param func the function to apply
 * @returns a new mapped object
 */
export function objMap(obj, func) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
}

/**
 * Returns a list of tags + count for an array of objects
 * @param objects the object array
 * @param tagField the name of the field containing the tags
 * @returns an object containing the tags and associated counts
 */
export function getTagStatsForObjects(objects: Object[], tagField: string) {
  const stats = {};
  objects.map((item) => {
    item[tagField]?.map((tagName) => {
      stats[tagName] = stats[tagName] ? stats[tagName] : 0;
      stats[tagName]++;
    });
  });
  return stats;
}

/**
 * Returns a URL pointing to a file type icon
 * @param extension the file extension
 * @returns a URL
 */
export function getFileTypeIconUrl(extension: string) {
  const hostingUrl = 'https://s3.amazonaws.com/assets-evalforce.com/filetypes/';
  let iconName = 'text.svg';

  switch (extension) {
    case 'xls':
    case 'xlsx':
      iconName = 'xls.svg';
      break;
    case 'doc':
    case 'docx':
      iconName = 'doc.svg';
      break;
    case 'zip':
    case 'tar':
    case 'bz':
      iconName = 'zip.svg';
      break;
  }
  return hostingUrl + iconName;
}

/**
 * Sorts an array of objects by the specified key. Default key is "weight"
 * @param obj1 the first object
 * @param obj2 the second object
 * @returns int
 */
export function sortByObjectKey(obj1, obj2, key = 'weight') {
  if (obj1[key] < obj2[key]) {
    return -1;
  }
  if (obj1[key] > obj2[key]) {
    return 1;
  }
  return 0;
}

/**
 * Returns a string containing DB params placeholders, eg $1, $2 etc...
 * @param keys array the given params
 * @param index int the index at which to start
 * @returns int
 */
export function dbParamPlaceholderString(keys, index = 1) {
  if (!Array.isArray(keys)) {
    return `$${index}`;
  }
  return keys.map(() => `$${index++}`);
}

/**
 * Replaces the params in the provided SQL query
 * @param sql string the SQL query to replace
 * @param params array the array of params
 * @returns string the updated SQL query
 */
export function getRawSql(sql, params) {
  params.forEach((value, index) => {
    if (typeof value === 'string') {
      sql = sql.replace(`$${index + 1}`, `'${value}'`);
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        sql = sql.replace(
          `$${index + 1}`,
          value
            .map((element) =>
              typeof element === 'string' ? `'${element}'` : element,
            )
            .join(','),
        );
      } else {
        sql = sql.replace(`$${index + 1}`, value);
      }
    }
    if (['number', 'boolean'].includes(typeof value)) {
      sql = sql.replace(`$${index + 1}`, value.toString());
    }
  });

  return sql;
}

export function getDateTime(date?: Date) {
  // current timestamp in milliseconds
  let ts = date ? date : Date.now();
  let date_time = new Date(ts);

  return `${date_time.toLocaleString()}`;
}

export function getDate(date?: Date) {
  if (!date) return null;

  return moment(date).format('MM/DD/YYYY');
}

export function getCurrentDay() {
  const d = new Date();

  return moment(d).format('MMMM Do YYYY');
}


export function propertyOf<TObj>(name: keyof TObj) {
  return name;
}

export function slugify(str: string) {
  let slug = '';

  //Đổi chữ hoa thành chữ thường
  slug = str.toLowerCase();

  //Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  //Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  //Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, "-");
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  //Xóa các ký tự gạch ngang ở đầu và cuối
  slug = '@' + slug + '@';
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  //In slug ra textbox có id “slug”

  return slug;
}

export function getSkip(page: number, size: number) {
  return (page - 1) * size;
}

export function getPermissionsFromRoles(roles) {
  // console.log('roles', roles);

  const flatPermissions = [];
  forOwn(PERMISSIONS, (permissions, subject) => {
    return forOwn(permissions, (perm: any, action) => {
      // console.log('perm', perm);
      const matchingRoles = perm.roles.filter((value) => roles.includes(value));
      // console.log('matchingRoles', matchingRoles);
      if (matchingRoles.length) {
        flatPermissions.push(perm.key);
      }
    });
  });

  // console.log('flatPermissions', flatPermissions);

  return flatPermissions;
}

export function generateOrderCode() {
  return Date.now().toString().slice(7);
}

export function generatePassword(length: number): string {
  var generator = require('generate-password');

  return generator.generate({
    length,
    numbers: true,
  });
}

// utils/slug.ts
export const slugifyVN = (str: string): string =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// const slug = slugifyVN(`${title}-${address_detail}`);


export function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function generateRoomCode(length = 5): string {
  const bytes = randomBytes(length);
  let code = '';

  for (let i = 0; i < length; i++) {
    code += CHARS[bytes[i] % CHARS.length];
  }

  return code;
}