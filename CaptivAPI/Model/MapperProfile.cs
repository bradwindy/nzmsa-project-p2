using AutoMapper;

namespace Captiv.Model
{
    public class MapperProfile: Profile
    {
        public MapperProfile()
        {
            CreateMap<Video, VideoDTO>();
            CreateMap<VideoDTO, Video>();
        }
    }
}
