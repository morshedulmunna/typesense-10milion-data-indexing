/*import AxiosWrapper from "../util/axiosWrapper";

@Injectable()
export class DatasetService {
  private weaviateWrapper: WeaviateWrapper;
  private openAIwrapper: OpenAIAnswerGenerator;
  private axiosWrapper: AxiosWrapper;
  private axios: AxiosWrapper;

  public constructor(
    private readonly db: DatasetDB,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService
  ) {
    this.weaviateWrapper = new WeaviateWrapper();
    this.openAIwrapper = new OpenAIAnswerGenerator();
    this.axios = new AxiosWrapper(process.env.Ml_SERVICE_URL ?? 'http://127.0.0.1:8000/');
  }

  */
