import cron, { ScheduledTask } from "node-cron";

export class CronSync {
  private task: ScheduledTask | null = null;

  private todo: () => void;

  constructor(todo: () => void) {
    this.todo = todo;
  }

  /**
   * Schedule a cron job
   * @param expression The cron expression
   */
  public scheduleAndStart(expression: string) {
    this.stop();
    this.task = cron.schedule(expression, this.todo);
    this.task.start();
  }

  /**
   * Stop the cron job
   */
  public stop() {
    if (this.task) this.task.stop();
  }
}
