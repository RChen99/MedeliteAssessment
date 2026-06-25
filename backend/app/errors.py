class FacilityNotFoundError(Exception):
    def __init__(self, ccn: str) -> None:
        super().__init__(
            f"No facility found for CCN {ccn}. Please check the number and try again."
        )
        self.ccn = ccn


class CmsApiError(Exception):
    def __init__(self, message: str = "Unable to reach CMS data. Please try again.") -> None:
        super().__init__(message)
