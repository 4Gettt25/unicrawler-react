from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, create_engine, Text

Base = declarative_base()

class FileMetadata(Base):
    __tablename__ = 'file_metadata'
    id = Column(Integer, primary_key=True)
    file_name = Column(String)
    file_path = Column(String)
    topic = Column(String)  # topics can be extracted from files or user input
    text_content = Column(Text)

Base.metadata.create_all(create_engine('sqlite:///database.db'))