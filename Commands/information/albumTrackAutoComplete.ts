import { BaseInterface, Musixmatch } from 'node-musixmatch-api';

const mxm = new Musixmatch(process?.env['Musixmatch'.toString()]);

interface AlbumTracks extends BaseInterface {
  message: {
    header: {
      status_code: number;
      execute_time: number;
      available: number;
    };
    body: {
      track_list: Array<{
        track: {
          track_id: number;
          track_mbid: string;
          track_length: number;
          lyrics_id: number;
          instrumental: number;
          subtitle_id: number;
          track_name: string;
          track_rating: number;
          album_name: string;
          album_id: number;
          artist_id: number;
          album_coverart_100x100: string;
          artist_mbid: string;
          artist_name: string;
          updated_time: string;
        };
      }>;
    };
  };
}

const albumInfoGet = async (album_id: string): Promise<AlbumTracks> => {
  const albumSearch = await mxm.albumTracksGet(`album_id=${album_id}`);
  return albumSearch;
};

export { albumInfoGet };
