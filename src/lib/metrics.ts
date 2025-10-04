/**
 * Utility functions for calculating dashboard metrics
 */

/**
 * Calculates the total number of objectives
 * @param objectives - Array of objective objects
 * @returns Total count of objectives
 */
export function calculateTotalObjectives(objectives: any[]): number {
  return objectives.length;
}

/**
 * Calculates the number of completed objectives
 * @param objectives - Array of objective objects
 * @returns Count of objectives with status 'COMPLETED'
 */
export function calculateCompletedObjectives(objectives: any[]): number {
  return objectives.filter(obj => obj.status === 'COMPLETED').length;
}

/**
 * Calculates the number of blocked objectives
 * @param objectives - Array of objective objects
 * @returns Count of objectives with status 'PAUSED'
 */
export function calculateBlockedObjectives(objectives: any[]): number {
  return objectives.filter(obj => obj.status === 'PAUSED').length;
}

/**
 * Calculates the average health score of objectives
 * @param objectives - Array of objective objects
 * @returns Average health score rounded to nearest integer, or 100 if no objectives
 */
export function calculateAverageHealthScore(objectives: any[]): number {
  if (objectives.length > 0) {
    const totalHealthScore = objectives.reduce((sum, obj) => sum + obj.healthScore, 0);
    return Math.round(totalHealthScore / objectives.length);
  } else {
    return 100;
  }
}