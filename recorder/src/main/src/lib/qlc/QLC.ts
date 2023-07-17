import * as osc from "osc";

export class QLC {
  constructor() {
    const udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 57121,
      metadata: true,
    });
  }

  public updateChannel(channel: string, value: number) {}
}
