package com.example.letters.util;

public class DBFile {

    public String fileName;
    public byte[] file;

    public DBFile() {
    }

    public DBFile(String fileName, byte[] file) {
        this.fileName = fileName;
        this.file = file;
    }

    public static DBFile fromObject(Object obj) {
        DBFile newDBFile = new DBFile();
        Class<?> clazz = obj.getClass();
        try {
            newDBFile.fileName = (String) clazz.getField("1").get(obj);
        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException(e);
        }

        return newDBFile;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }
}
