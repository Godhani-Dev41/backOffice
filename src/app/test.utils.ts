import { TruncatePipe } from "@app/shared/pipes/truncate.pipe";
import { HttpClient } from "@angular/common/http";

export const TEST_PROVIDERS = [TruncatePipe];

export const TEST_HTTP_MOCK = [
  {
    provide: HttpClient,
    useExisting: HttpClient,
    deps: [HttpClient],
  },
  // MockBackend,
  // BaseRequestOptions
];
