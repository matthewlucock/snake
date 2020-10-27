export class Clock {
  public running = false
  public tickDuration = Infinity
  private lastTickTime = 0

  public tick = (): void => {}

  private readonly loop = (time: number): void => {
    if (!this.running) return

    const timeSinceLastTick = time - this.lastTickTime

    if (timeSinceLastTick > this.tickDuration) {
      const ticks = Math.floor(timeSinceLastTick / this.tickDuration)

      for (let i = 0; i < ticks; i++) {
        if (this.running) this.tick()
      }

      this.lastTickTime += ticks * this.tickDuration
    }

    requestAnimationFrame(this.loop)
  }

  public start (): void {
    this.running = true
    this.lastTickTime = performance.now()
    requestAnimationFrame(this.loop)
  }
}
