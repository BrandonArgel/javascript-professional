import MediaPlayer from '../../MediaPlayer';
import Ads, {Ad} from './Ads';

class AdsPlugin {
  private player: MediaPlayer;
  private media: HTMLMediaElement;
  private ads: Ads;
  private currentAd: Ad;
  private adsContainer: HTMLElement;

  constructor() {
    this.ads = Ads.getInstance()
    this.adsContainer = document.createElement('div');
  }

  run(player: MediaPlayer) {
    this.player = player;
    this.player.container.appendChild(this.adsContainer);
    this.media = this.player.media;
    this.media.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
  }

  private handleTimeUpdate() {
    const currentTime = Math.floor(this.media.currentTime);
    if (currentTime % 30 === 0) {
      this.renderAd();
    }
  }

  private renderAd() {
    if (this.currentAd) {
      return;
    }
    const ad = this.ads.getAd();
    this.currentAd = ad;
    console.log(this.currentAd);
    
    this.adsContainer.innerHTML = `
        <div class="ads">
            <button class="ads__close">x</button>
            <a class="link" href="${this.currentAd.url}" target="_blank">
                <img class="ads__img" src="${this.currentAd.imageUrl}" />
                <div class="ads__info">
                    <h5 class="ads__title">${this.currentAd.title}</h5>
                    <p class="ads__body">${this.currentAd.body}</p>
                </div>
            </a>
        </div>
    `;

    const closeAdButton = document.querySelector('.ads__close');
    
    if (closeAdButton) {
      closeAdButton.addEventListener('click', () => {
        this.adsContainer.innerHTML = '';
        this.currentAd = null;
      });
    }

    setTimeout(() => {
      this.currentAd = null;
      this.adsContainer.innerHTML = '';
    }, 10000);

  }
}

export default AdsPlugin;