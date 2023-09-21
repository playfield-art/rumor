from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    rumor_cms_url: str = ""
    rumor_cms_api_key: str = ""
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()